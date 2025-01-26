import React from "react";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import FrontofficeCRUD from "../pages/frontoffice-crud"; 

describe('Expression Test', () => {
  it('should be true for matching condition', () => {
    const token = 'some-jwt-token'; 
    const isValid = token === 'some-jwt-token'; // 
    expect(isValid).to.be.true;
  });

  it('should be false for non-matching condition', () => {
    const token = 'wrong-token'; 
    const isValid = token === 'some-jwt-token'; 
    expect(isValid).to.be.false;
  });
});
