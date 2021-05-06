import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import '../styles/Inputs.css';

const InputField = ({ cachedEntities, index, handleChange }) => {
  const [value, setValue] = useState('');

  const [suggestions, setSuggestions] = useState([]);

  const onChange = (event, { newValue }) => {
    handleChange(newValue, index);
    setValue(newValue);
  };

  const onSuggestionSelected = (event, { suggestionValue }) => {
    handleChange(suggestionValue, index);
    setValue(suggestionValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return cachedEntities.filter((language) => regex.test(language.name));
  };

  const getSuggestionValue = (suggestion) => {
    return suggestion.name;
  };

  const renderSuggestion = (suggestion) => {
    return <span>{suggestion.name}</span>;
  };

  const inputProps = {
    placeholder: '',
    value,
    onChange: onChange,
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionSelected={onSuggestionSelected}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  );
};

export default InputField;
