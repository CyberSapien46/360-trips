
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Loader } from 'lucide-react';

interface PanoramaViewerProps {
  imageUrl: string;
  className?: string;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ imageUrl, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
        const material = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        console.log('Loading panorama texture from URL:', imageUrl);
        
        textureLoader.load(
          imageUrl,
          (texture) => {
            console.log('Panorama texture loaded successfully');
            texture.colorSpace = THREE.SRGBColorSpace;
            mesh.material = new THREE.MeshBasicMaterial({ map: texture });
            setIsLoading(false);
          },
          (progressEvent) => {
            console.log('Loading progress:', progressEvent);
          },
          (error) => {
            console.error('Error loading panorama texture:', error);
            setError('Failed to load panorama image. Please try again later.');
            setIsLoading(false);
          }
        );
        
        renderer = new THREE.WebGLRenderer();
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
      requestAnimationFrame(animate);
      update();
    };
    
    const update = () => {
      if (!camera) return;
      
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
      if (containerRef.current && renderer) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('pointerdown', onPointerDown);
        containerRef.current.removeEventListener('pointermove', onPointerMove);
        containerRef.current.removeEventListener('pointerup', onPointerUp);
        containerRef.current.removeEventListener('wheel', onDocumentMouseWheel);
      }
      
      window.removeEventListener('resize', onWindowResize);
      
      renderer?.dispose();
    };
  }, [imageUrl]);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative w-full aspect-video rounded-lg overflow-hidden ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 animate-spin text-primary mb-2" />
            <div>Loading 360° view...</div>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PanoramaViewer;
