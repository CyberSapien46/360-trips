
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Loader, Headphones, Maximize, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PanoramaViewerProps {
  imageUrl: string;
  className?: string;
  destinationName?: string;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ 
  imageUrl, 
  className = '',
  destinationName 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setRetryCount(prev => prev + 1);
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Reset state when image URL changes
    setIsLoading(true);
    setError(null);
    
    // If already initialized, clean up previous scene
    if (isInitializedRef.current) {
      const container = containerRef.current;
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      isInitializedRef.current = false;
    }
    
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let isUserInteracting = false;
    let onPointerDownMouseX = 0, onPointerDownMouseY = 0;
    let lon = 0, onPointerDownLon = 0;
    let lat = 0, onPointerDownLat = 0;
    let phi = 0, theta = 0;
    let animationId: number;
    // Add auto-rotation state here
    let autoRotate = true;
    let autoRotateTimeout: NodeJS.Timeout;
    
    // Initialize the scene
    const init = () => {
      const container = containerRef.current;
      if (!container) return;
      
      try {
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1100);
        camera.position.z = 0.01;
        
        // Create a sphere and add a panoramic texture to it
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1); // Invert the sphere so we're inside it
        
        const textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = 'anonymous'; // Ensure cross-origin images load properly
        
        // Add a basic material first (will be replaced when texture loads)
        const material = new THREE.MeshBasicMaterial({ 
          color: 0x222222,
          wireframe: false,
          side: THREE.BackSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        console.log('Loading panorama texture from URL:', imageUrl);
        
        // Try using a proxy service for cross-origin images that might not allow CORS
        const imagesToTry = [
          imageUrl,
          // Fallback to a more reliable image if the original doesn't load
          'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?q=80&w=2000&auto=format&fit=crop'
        ];
        
        const loadTexture = (index = 0) => {
          if (index >= imagesToTry.length) {
            console.error('All image loading attempts failed');
            setError('Failed to load panorama image. Please try again later.');
            setIsLoading(false);
            return;
          }
          
          const currentImageUrl = imagesToTry[index];
          
          textureLoader.load(
            currentImageUrl,
            (texture) => {
              console.log('Panorama texture loaded successfully');
              texture.colorSpace = THREE.SRGBColorSpace;
              mesh.material = new THREE.MeshBasicMaterial({ 
                map: texture,
                side: THREE.BackSide 
              });
              setIsLoading(false);
              
              // Setup auto-rotation handlers
              const startAutoRotation = () => {
                autoRotate = true;
              };
              
              const stopAutoRotation = () => {
                autoRotate = false;
                
                // Restart auto-rotation after 5 seconds of inactivity
                clearTimeout(autoRotateTimeout);
                autoRotateTimeout = setTimeout(startAutoRotation, 5000);
              };
              
              container.addEventListener('pointerdown', stopAutoRotation);
            },
            (progressEvent) => {
              console.log('Loading progress:', progressEvent);
            },
            () => {
              console.error(`Attempt ${index + 1} failed, trying next image source`);
              loadTexture(index + 1);
            }
          );
        };
        
        loadTexture();
        
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Event listeners for mouse/touch interaction
        container.addEventListener('pointerdown', onPointerDown);
        container.addEventListener('pointermove', onPointerMove);
        container.addEventListener('pointerup', onPointerUp);
        container.addEventListener('wheel', onDocumentMouseWheel);
        
        window.addEventListener('resize', onWindowResize);
        
        isInitializedRef.current = true;
      } catch (err) {
        console.error('Error initializing 360 viewer:', err);
        setError('Failed to initialize 360° viewer. Please try refreshing the page.');
        setIsLoading(false);
      }
    };
    
    const onWindowResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current) return;
      
      isUserInteracting = true;
      
      const clientRect = containerRef.current.getBoundingClientRect();
      onPointerDownMouseX = event.clientX - clientRect.left;
      onPointerDownMouseY = event.clientY - clientRect.top;
      
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    };
    
    const onPointerMove = (event: PointerEvent) => {
      if (!containerRef.current || !isUserInteracting) return;
      
      const clientRect = containerRef.current.getBoundingClientRect();
      const clientX = event.clientX - clientRect.left;
      const clientY = event.clientY - clientRect.top;
      
      lon = (onPointerDownMouseX - clientX) * 0.1 + onPointerDownLon;
      lat = (clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
    };
    
    const onPointerUp = () => {
      isUserInteracting = false;
    };
    
    const onDocumentMouseWheel = (event: WheelEvent) => {
      if (!camera) return;
      
      const fov = camera.fov + event.deltaY * 0.05;
      camera.fov = THREE.MathUtils.clamp(fov, 30, 90);
      camera.updateProjectionMatrix();
    };
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      update();
    };
    
    // The complete update function with auto-rotation
    const update = () => {
      if (!camera) return;
      
      // Apply auto-rotation if enabled
      if (autoRotate) {
        lon += 0.05;
      }
      
      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);
      
      camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
      camera.position.y = 100 * Math.cos(phi);
      camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
      
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    
    init();
    animate();
    
    // Clean up
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      if (containerRef.current && renderer) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('pointerdown', onPointerDown);
        containerRef.current.removeEventListener('pointermove', onPointerMove);
        containerRef.current.removeEventListener('pointerup', onPointerUp);
        containerRef.current.removeEventListener('wheel', onDocumentMouseWheel);
      }
      
      window.addEventListener('resize', onWindowResize);
      
      renderer?.dispose();
    };
  }, [imageUrl, retryCount]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative w-full aspect-video rounded-lg overflow-hidden ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 animate-spin text-primary mb-2" />
            <div>Loading {destinationName ? destinationName + " in" : ""} 360° view...</div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/80 text-center p-4">
          <div className="bg-background rounded-lg p-4 shadow-lg max-w-sm">
            <p className="text-destructive font-medium mb-2">Error Loading 360° View</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2 text-muted-foreground">
              Please try a different destination or check your internet connection.
            </p>
            <Button 
              onClick={handleRetry} 
              size="sm" 
              variant="outline" 
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          <Button 
            onClick={toggleFullscreen} 
            size="sm" 
            variant="secondary" 
            className="backdrop-blur-sm bg-black/30 text-white hover:bg-black/50"
          >
            <Maximize className="h-4 w-4 mr-2" />
            {isFullscreen ? "Exit VR View" : "Enter VR View"}
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            className="backdrop-blur-sm bg-black/30 text-white hover:bg-black/50"
            asChild
          >
            <a href="/vr-booking">
              <Headphones className="h-4 w-4 mr-2" />
              Book VR Demo
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PanoramaViewer;
