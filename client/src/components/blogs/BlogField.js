import React from "react";

export default ({ input, label, meta: { error, touched } }) => {
    return (
        <div className={input.name}>
            <label>{label}</label>
            <input
                {...input}
                style={{ marginBottom: "5px" }}
                autoComplete="off"
            />
            <div className="red-text" style={{ marginBottom: "20px" }}>
                {touched && error}
            </div>
        </div>
    );
};
