import React, { Component } from 'react';
import moment from 'moment';

import { Label } from 'semantic-ui-react';
import { getViewReadyDate } from '../../utils/translation/format.date';

class FormattedDate extends Component {
    _getDaysRemaining(ISODate) {
        return moment(ISODate).diff(moment.utc(), 'days');
    }

    render() {
        const { showDaysRemaining, ISODate } = this.props;

        return (
            <div>
                {getViewReadyDate(ISODate)} 
                {
                    showDaysRemaining
                        ? <Label circular pointing='left'>{this._getDaysRemaining(ISODate) + ' d'}</Label>
                        : ''
                }
            </div> 
        );
    }
}

export default FormattedDate;
