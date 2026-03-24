import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-light text-muted mt-5">
            <div className="container py-4">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <h5 className="fw-bold text-dark">TechForge</h5>
                        <p className="small mb-0">Quality PC parts, curated builds and fast delivery. Shop CPUs, GPUs, storage and more.</p>
                    </div>

                    <div className="col-md-2 mb-3">
                        <h6 className="fw-semibold text-dark">Products</h6>
                        <ul className="list-unstyled small mb-0">
                            <li><a href="#" className="text-muted text-decoration-none">CPU</a></li>
                            <li><a href="#" className="text-muted text-decoration-none">GPU</a></li>
                            <li><a href="#" className="text-muted text-decoration-none">RAM</a></li>
                            <li><a href="#" className="text-muted text-decoration-none">Storage</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3 mb-3">
                        <h6 className="fw-semibold text-dark">Support</h6>
                        <ul className="list-unstyled small mb-0">
                            <li><a href="#" className="text-muted text-decoration-none">Help Center</a></li>
                            <li><a href="#" className="text-muted text-decoration-none">Shipping & Returns</a></li>
                            <li><a href="#" className="text-muted text-decoration-none">Contact Us</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3 mb-3">
                        <h6 className="fw-semibold text-dark">Follow Us</h6>
                        <div className="d-flex gap-3 align-items-center mt-2">
                            <a href="#" className="text-muted fs-5"><i className="fa-brands fa-facebook"></i></a>
                            <a href="#" className="text-muted fs-5"><i className="fa-brands fa-twitter"></i></a>
                            <a href="#" className="text-muted fs-5"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" className="text-muted fs-5"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>
                </div>

                <div className="border-top pt-3 mt-3 small d-flex justify-content-between align-items-center">
                    <div className="text-muted">© {new Date().getFullYear()} TechForge. All rights reserved.</div>
                    <div className="text-muted">Built with <i className="fa-solid fa-heart text-danger"></i></div>
                </div>
            </div>
        </footer>
    );
}
