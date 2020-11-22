import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

SearchForm.propTypes = {
    onSubmit: PropTypes.func,
    onFocus: PropTypes.func,
};

SearchForm.defaultProps = {
    onSubmit: null,
    onFocus: null
}

function SearchForm(props) {
    const { onSubmit, onFocus } = props;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('post');
    const typingTimeoutRef = useRef(null);
    function handleSearchTermChange() {
        const value = document.getElementById("search-field").value;
        // const value = e.target.value;
        // var searchType = 'post';
        // if (value.charAt(0) === '@') {
        //     searchType = 'user';
        // }
        setSearchTerm(value);

        if (!onSubmit) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        };

        typingTimeoutRef.current = setTimeout(() => {
            const formValues = {
                searchTerm: value,
                searchType: searchType
            };

            onSubmit(formValues);
        }, 300);
    }

    function handleChangeSearchType(e){
        setSearchType(e.target.value);
        // console.log(e.target.value);
    }
    useEffect(() => {
        handleSearchTermChange();
        handleIsFocus(true);
    },[searchType])
    // const [isFocus, setIsFocus] = useState(false);
    function handleIsFocus(value) {
        if (!onFocus) return;
        onFocus(value);
    }
    return (
        <div>
            <form className="form-inline my-2 my-lg-0">
                <div className="input-group">
                    <input
                        id="search-field"
                        className="form-control mr-sm-2"
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        onFocus={() => { handleIsFocus(true) }}
                        // onBlur={() => { handleIsFocus(false) }}
                    />
                    <div className="input-group-append">
                        {/* <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button> */}
                        <select value={searchType} onChange={handleChangeSearchType} className="custom-select" id="fiter-search">
                            <option value={'post'}>Post</option>
                            <option value={'user'}>User</option>
                            <option value={'community'}>Community</option>
                        </select>

                    </div>
                </div>
                {/* <button className="btn btn-outline-success my-2 my-sm-0" type="submit"><i className="fa fa-search" aria-hidden="true" /></button> */}
            </form>
            {/* {
                // isFocus === true ?
                
                    <div className="form-group row filter">
                        <div className="col-sm-10 radio-filter">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" defaultValue="option1" />
                                <label className="form-check-label" htmlFor="inlineRadio1">Post</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" defaultValue="option2" />
                                <label className="form-check-label" htmlFor="inlineRadio2">User</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" defaultValue="option3" />
                                <label className="form-check-label" htmlFor="inlineRadio3">Community</label>
                            </div>
                        </div>
                    </div>
                    // : null
            } */}

        </div>
    );
}

export default SearchForm;