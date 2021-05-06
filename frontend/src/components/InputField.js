import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { HiMinusCircle } from 'react-icons/hi';
import '../styles/Inputs.css';

const InputField = ({
  cachedEntities,
  index,
  handleChange,
  handleRemove,
  name,
  form,
}) => {
  const [value, setValue] = useState(name);

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setValue(name);
  }, [name]);

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
    <>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <HiMinusCircle
        size={30}
        id="minus-entity-button"
        className={form.entities.length === 1 ? 'disabled' : ''}
        onClick={() => {
          handleRemove(index);
        }}
      />
    </>
  );
};

export default InputField;
