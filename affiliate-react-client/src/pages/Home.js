function Home() {
    return (
        <div className="container py-5">
            {/* Hero Section */}
            <section className="text-center mb-5">
                <h1 className="fw-bold">Track Your Website Visits Smarter</h1>
                <p className="text-muted mt-3">
                    Monitor, manage, and analyze website and affiliate link visits
                    in one simple dashboard.
                </p>

                <div className="mt-4">
                    <button className="btn btn-primary me-3">Get Started</button>
                    <button className="btn btn-outline-secondary">View Dashboard</button>
                </div>
            </section>

            {/* Features Section */}
            <section className="row text-center mb-5">
                <div className="col-md-4 mb-4">
                    <h5>📊 Visit Tracking</h5>
                    <p className="text-muted">
                        Track how many times your websites or affiliate links are visited.
                    </p>
                </div>

                <div className="col-md-4 mb-4">
                    <h5>🔗 Link Management</h5>
                    <p className="text-muted">
                        Add, edit, and manage multiple links from a single place.
                    </p>
                </div>

                <div className="col-md-4 mb-4">
                    <h5>📈 Insights & Analytics</h5>
                    <p className="text-muted">
                        Understand performance and optimize your affiliate strategy.
                    </p>
                </div>
            </section>

            {/* Stats Preview Section */}
            <section className="row text-center mb-5">
                <div className="col-md-3">
                    <h3>0+</h3>
                    <p className="text-muted">Tracked Links</p>
                </div>
                <div className="col-md-3">
                    <h3>0+</h3>
                    <p className="text-muted">Total Visits</p>
                </div>
                <div className="col-md-3">
                    <h3>0+</h3>
                    <p className="text-muted">Active Campaigns</p>
                </div>
                <div className="col-md-3">
                    <h3>100%</h3>
                    <p className="text-muted">Data Transparency</p>
                </div>
            </section>

            {/* Call to Action */}
            <section className="text-center">
                <h4 className="mb-3">Start tracking your affiliate traffic today</h4>
                <button className="btn btn-success btn-lg">
                    Create Your First Link
                </button>
            </section>
        </div>
    );
}

export default Home;
