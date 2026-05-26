import React, { useState } from 'react';
    import { Form, FormControl } from 'react-bootstrap';
    
    function SearchBar({ onSearch }) {
      const [searchTerm, setSearchTerm] = useState('');
    
      const handleChange = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value); // Trigger search on input change
      };
    
      return (
        <Form inline>
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            value={searchTerm}
            onChange={handleChange}
          />
        </Form>
      );
    }
    
    export default SearchBar;