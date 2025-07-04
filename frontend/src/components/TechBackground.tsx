'use client'

import React from 'react'

interface TechBackgroundProps {
    children: React.ReactNode
}

const TechBackground: React.FC<TechBackgroundProps> = ({ children }) => {
    return (
        <div className="tech-background min-h-screen relative">
            {/* Animated SVG Background Elements */}
            <div className="floating-elements">
                {/* Circuit Board Pattern */}
                <svg className="floating-element" width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <path d="M10 10h10v10h-10z" stroke="rgba(47, 128, 237, 0.3)" strokeWidth="1" fill="none" />
                    <path d="M40 10h10v10h-10z" stroke="rgba(47, 128, 237, 0.3)" strokeWidth="1" fill="none" />
                    <path d="M10 40h10v10h-10z" stroke="rgba(47, 128, 237, 0.3)" strokeWidth="1" fill="none" />
                    <path d="M40 40h10v10h-10z" stroke="rgba(47, 128, 237, 0.3)" strokeWidth="1" fill="none" />
                    <path d="M20 15h20" stroke="rgba(47, 128, 237, 0.4)" strokeWidth="1" />
                    <path d="M20 45h20" stroke="rgba(47, 128, 237, 0.4)" strokeWidth="1" />
                    <path d="M15 20v20" stroke="rgba(47, 128, 237, 0.4)" strokeWidth="1" />
                    <path d="M45 20v20" stroke="rgba(47, 128, 237, 0.4)" strokeWidth="1" />
                </svg>

                {/* Neural Network Nodes */}
                <svg className="floating-element" width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="20" cy="20" r="3" fill="rgba(47, 128, 237, 0.6)" />
                    <circle cx="60" cy="20" r="3" fill="rgba(47, 128, 237, 0.6)" />
                    <circle cx="40" cy="40" r="3" fill="rgba(47, 128, 237, 0.6)" />
                    <circle cx="20" cy="60" r="3" fill="rgba(47, 128, 237, 0.6)" />
                    <circle cx="60" cy="60" r="3" fill="rgba(47, 128, 237, 0.6)" />
                    <line x1="20" y1="20" x2="40" y2="40" stroke="rgba(47, 128, 237, 0.3)" strokeWidth="1" />
                    <line x1="60" y1="20" x2="40" y2="40" stroke="rgba(47, 128, 237, 0.3)" strokeWidth="1" />
                    <line x1="40" y1="40" x2="20" y2="60" stroke="rgba(47, 128, 237, 0.3)" strokeWidth="1" />
                    <line x1="40" y1="40" x2="60" y2="60" stroke="rgba(47, 128, 237, 0.3)" strokeWidth="1" />
                </svg>

                {/* Data Flow Lines */}
                <svg className="floating-element" width="100" height="40" viewBox="0 0 100 40" fill="none">
                    <path d="M0 20 Q25 10 50 20 T100 20" stroke="rgba(47, 128, 237, 0.4)" strokeWidth="2" fill="none" strokeDasharray="5,5">
                        <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
                    </path>
                    <circle cx="0" cy="20" r="2" fill="rgba(47, 128, 237, 0.8)">
                        <animate attributeName="cx" values="0;100" dur="3s" repeatCount="indefinite" />
                    </circle>
                </svg>

                {/* Binary Code */}
                <svg className="floating-element" width="120" height="60" viewBox="0 0 120 60" fill="none">
                    <text x="10" y="15" fill="rgba(47, 128, 237, 0.5)" fontSize="8" fontFamily="monospace">101010</text>
                    <text x="10" y="30" fill="rgba(47, 128, 237, 0.5)" fontSize="8" fontFamily="monospace">110011</text>
                    <text x="10" y="45" fill="rgba(47, 128, 237, 0.5)" fontSize="8" fontFamily="monospace">100101</text>
                </svg>

                {/* AI Brain Icon */}
                <svg className="floating-element" width="70" height="70" viewBox="0 0 70 70" fill="none">
                    <path d="M35 10c-8 0-15 7-15 15s7 15 15 15 15-7 15-15-7-15-15-15z" stroke="rgba(47, 128, 237, 0.6)" strokeWidth="2" fill="none" />
                    <path d="M20 35c0 8 7 15 15 15s15-7 15-15" stroke="rgba(47, 128, 237, 0.6)" strokeWidth="2" fill="none" />
                    <circle cx="35" cy="35" r="3" fill="rgba(47, 128, 237, 0.8)" />
                    <path d="M30 30l10 10M40 30l-10 10" stroke="rgba(47, 128, 237, 0.6)" strokeWidth="1" />
                </svg>

                {/* Process Flow */}
                <svg className="floating-element" width="90" height="50" viewBox="0 0 90 50" fill="none">
                    <rect x="5" y="15" width="20" height="20" rx="3" stroke="rgba(47, 128, 237, 0.4)" strokeWidth="1" fill="none" />
                    <rect x="35" y="15" width="20" height="20" rx="3" stroke="rgba(47, 128, 237, 0.4)" strokeWidth="1" fill="none" />
                    <rect x="65" y="15" width="20" height="20" rx="3" stroke="rgba(47, 128, 237, 0.4)" strokeWidth="1" fill="none" />
                    <path d="M25 25h10" stroke="rgba(47, 128, 237, 0.5)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <path d="M55 25h10" stroke="rgba(47, 128, 237, 0.5)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(47, 128, 237, 0.5)" />
                        </marker>
                    </defs>
                </svg>
            </div>

            {/* Data Stream Lines */}
            <div className="data-stream">
                <div className="data-line"></div>
                <div className="data-line"></div>
                <div className="data-line"></div>
                <div className="data-line"></div>
            </div>

            {/* Neural Network Dots */}
            <div className="neural-dots">
                <div className="neural-dot"></div>
                <div className="neural-dot"></div>
                <div className="neural-dot"></div>
                <div className="neural-dot"></div>
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