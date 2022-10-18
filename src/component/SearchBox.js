import React, { useState } from 'react';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          placeholder="Search"
          aria-label="Search products"
          aria-describedby="button-search"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          variant="outline-primary"
          type="submit"
          id="button-search"
          className="e"
        >
          <i className="fas fa-search" />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;
