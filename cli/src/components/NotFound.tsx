import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="container mt-5 text-center">
            <div className="row">
                <div className="col">
                    <h1 className="display-1">404 Not Found</h1>
                    <p className="lead">
                        Oops! Looks like the page you requested does not exist.
                    </p>
                    <Link to="/" className="btn btn-primary">
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
