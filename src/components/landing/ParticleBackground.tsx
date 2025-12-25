'use client';

import React, { useRef, useEffect } from 'react';

export const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const symbols = ['∑', 'μ', 'σ', 'β', 'ƒ', 'ρ', '∫', 'x̄', 's²', 'H₀', 'H₁'];
        
        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            char: string;
            opacity: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 12 + 6;
                this.speedX = Math.random() * 0.8 - 0.4;
                this.speedY = Math.random() * 0.8 - 0.4;
                this.char = symbols[Math.floor(Math.random() * symbols.length)];
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width + 10 || this.x < -10) this.speedX *= -1;
                if (this.y > canvas.height + 10 || this.y < -10) this.speedY *= -1;
                
                const dx = this.x - mouse.current.x;
                const dy = this.y - mouse.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    this.x += (dx / distance) * 2.5;
                    this.y += (dy / distance) * 2.5;
                }
            }

            draw() {
                if (ctx) {
                    ctx.fillStyle = `rgba(200, 220, 255, ${this.opacity})`;
                    ctx.font = `${this.size}px Vazirmatn`;
                    ctx.fillText(this.char, this.x, this.y);
                }
            }
        }
        
        let particles: Particle[] = [];

        function init() {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 18000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            for (const particle of particles) {
                particle.update();
                particle.draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', () => {
            resizeCanvas();
            init();
        });

        resizeCanvas();
        init();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
};
