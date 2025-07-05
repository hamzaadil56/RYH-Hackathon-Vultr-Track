'use client'

import React from 'react'

interface TechBackgroundProps {
    children: React.ReactNode
}

const TechBackground: React.FC<TechBackgroundProps> = ({ children }) => {
    return (
        <div className="tech-background min-h-screen relative bg-[#F4F8FB] dark:bg-[#0F172A]">
            {/* Simplified Animated Background - Performance Optimized */}
            <div className="floating-elements">
                {/* Reduced number of elements for better performance */}
                <svg className="floating-element" width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <path d="M10 10h10v10h-10z" stroke="rgba(47, 128, 237, 0.2)" strokeWidth="1" fill="none" />
                    <path d="M40 10h10v10h-10z" stroke="rgba(47, 128, 237, 0.2)" strokeWidth="1" fill="none" />
                    <path d="M10 40h10v10h-10z" stroke="rgba(47, 128, 237, 0.2)" strokeWidth="1" fill="none" />
                    <path d="M40 40h10v10h-10z" stroke="rgba(47, 128, 237, 0.2)" strokeWidth="1" fill="none" />
                </svg>

                {/* Neural Network Nodes - Simplified */}
                <svg className="floating-element" width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="20" cy="20" r="3" fill="rgba(47, 128, 237, 0.4)" />
                    <circle cx="60" cy="20" r="3" fill="rgba(47, 128, 237, 0.4)" />
                    <circle cx="40" cy="40" r="3" fill="rgba(47, 128, 237, 0.4)" />
                    <circle cx="20" cy="60" r="3" fill="rgba(47, 128, 237, 0.4)" />
                    <circle cx="60" cy="60" r="3" fill="rgba(47, 128, 237, 0.4)" />
                </svg>

                {/* AI Brain Icon - Simplified */}
                <svg className="floating-element" width="70" height="70" viewBox="0 0 70 70" fill="none">
                    <path d="M35 10c-8 0-15 7-15 15s7 15 15 15 15-7 15-15-7-15-15-15z" stroke="rgba(47, 128, 237, 0.4)" strokeWidth="2" fill="none" />
                    <circle cx="35" cy="35" r="3" fill="rgba(47, 128, 237, 0.6)" />
                </svg>
            </div>

            {/* Simplified Data Stream - Reduced animations */}
            <div className="data-stream">
                <div className="data-line"></div>
                <div className="data-line"></div>
            </div>

            {/* Reduced Neural Dots */}
            <div className="neural-dots">
                <div className="neural-dot"></div>
                <div className="neural-dot"></div>
                <div className="neural-dot"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}

export default TechBackground 