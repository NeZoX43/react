function NotFound() {
    return (
        <div className="page__404-container container">
            <section className="not-found">
                <h1 className="not-found__title">404</h1>
                <h2 className="not-found__subtitle">Page Not Found</h2>
                <p className="not-found__text">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <a className="not-found__link button" href="/">
                    Go to Homepage
                </a>
            </section>
        </div>
    );
}

export default NotFound;