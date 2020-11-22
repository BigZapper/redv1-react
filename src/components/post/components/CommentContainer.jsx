import React from 'react';
import PropTypes from 'prop-types';
import CommentSection from './comment-container/CommentSection';

CommentContainer.propTypes = {

};

function CommentContainer(props) {
    return (
        <div>            
            <CommentSection postId={props.postId} user={props.user} cookie={props.cookie} isAuthed={props.isAuthed} cmtCount={props.cmtCount} color={props.color}/>
        </div>
    );
}

export default CommentContainer;