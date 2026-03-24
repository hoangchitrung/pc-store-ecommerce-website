import { useState } from "react";
import { useEffect } from "react";
import { getProducts } from "../api/productApi";
import Footer from "../components/Footer.jsx";
import { ChatBubble } from "../components/ChatBubble.jsx";

export function HomePage() {
    // Use a full-height flex column so Footer stays at the bottom when content is short
    return (
        <div className="d-flex flex-column min-vh-100">
            <header className="container py-5">
                <h1 className="display-6 fw-bold">Welcome to TechForge</h1>
                <p className="lead text-muted">Find the best PC parts and curated builds.</p>
            </header>

            <main className="container flex-grow-1">
                {/* Placeholder for product listings / hero content */}
                <div className="py-4">
                    <p className="text-muted">Products will be displayed here.</p>
                </div>
            </main>

            <Footer />
            <ChatBubble />
        </div>
    );
}