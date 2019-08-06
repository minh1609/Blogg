import React from "react";

const Icon = props => {
    return (
        <div className="col-sm-6 col-md-3 my-3 " style={{ color: "#1a237e" }}>
            <i className={props.icon} style={{ fontSize: "80px" }} />
            <h5>{props.content}</h5>
        </div>
    );
};

const Landing = () => {
    return (
        <React.Fragment>
            <div style={{ textAlign: "center" }} className="row my-5">
                <Icon icon="fab fa-google" content="Log in with google" />
                <Icon
                    icon="fab fa-js-square"
                    content="Built with React and Node"
                />
                <Icon
                    icon="fas fa-user-secret"
                    content="All user data is kept secret"
                />
                <Icon
                    icon="fas fa-server"
                    content="Optimize server performance with Redis"
                />
            </div>
        </React.Fragment>
    );
};

export default Landing;
