import React, { useState } from 'react';
import PropTypes from 'prop-types';

CommentForm.propTypes = {
    postId: PropTypes.number,
    parentId: PropTypes.number,
    text: PropTypes.string,
    onSubmit: PropTypes.func,
};

CommentForm.defaultProps = {
    postId: null,
    parentId: null,
    text: '',
    onSubmit: null
}

function CommentForm(props) {
// console.log(props.color)
    const { postId, parentId, text, onSubmit, isAuthed } = props;
    const [textValue, setTextValue] = useState('');

    function handleValueChange(e) {
        setTextValue(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!onSubmit) return;

        const formValues = {
            postId: postId,
            parentId: parentId,
            content: textValue
        };
        onSubmit(formValues);

        setTextValue('');
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="comment">Your Comment</label>
                <textarea 
                    
                    name="comment" 
                    className="form-control" 
                    rows={3} 
                    value={textValue}
                    onChange={handleValueChange} 
                />
            </div>
            <button disabled={!isAuthed} type="submit" className="btn btn-primary join">Send</button>
        </form>
    );
}

export default CommentForm;