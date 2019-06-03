import React, { Component } from 'react';

class FormattedPrice extends Component {
    render() {
        const { priceInCents } = this.props;

        return (
            <div>
                {(priceInCents / 100).toLocaleString("en-US", {style:"currency", currency:"USD"})}
            </div> 
        );
    }
}

export default FormattedPrice;
