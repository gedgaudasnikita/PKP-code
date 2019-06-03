import React, { Component } from 'react';

import { Input, Button } from 'semantic-ui-react';

class File extends Component {
    render() {
        const { filename, downloadAction, removeAction, uploadAction, editable } = this.props;

        return (
            filename
                ?
                    <div>
                        <Button 
                            primary 
                            circular 
                            compact 
                            icon='file' 
                            onClick={downloadAction}
                        />
                        {filename}
                        {
                            editable
                                ?
                                    <Button 
                                        basic
                                        floated='right'
                                        primary 
                                        compact 
                                        icon='remove' 
                                        onClick={removeAction}
                                    />
                                : ''
                        }
                    </div>
                :
                    editable
                        ?
                            <Input
                                type='file'
                                icon='upload'
                                onChange={uploadAction}
                            />
                        :
                            <Button 
                                disabled 
                                compact 
                                circular 
                                icon='minus'
                            />
        );
    }
}

export default File;
