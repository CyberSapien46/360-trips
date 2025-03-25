
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        ref={modalRef}
        className="relative w-full max-w-5xl mx-2 bg-background rounded-lg shadow-lg animate-scale-in"
      >
        <div className="absolute -top-12 right-0">
          <Button 
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/20 hover:bg-white/40 text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full rounded-lg"
            src={videoUrl}
            title="VR Experience"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
