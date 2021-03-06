import { Handler } from '../src/handler';
import { ITypeValidationError, ValidationErrorType } from '../src/result';

import * as chai from 'chai';
import * as mocha from 'mocha';
const expect = chai.expect;

import { join } from 'path';

let dir = join(__dirname, 'specs', 'yaml');
let yaml = join(dir, 'swagger.yaml');
let validator = new Handler(yaml, {partialsDir: dir});


describe('GenericValidator', () => {
  it('should invalidate string instead of number', (done) => {
    let pet = {
      id: 'Not a number',
      name: 'Doge'
    };

    validator.validateModel(pet, 'Pet').then(result => {
      expect(result.errors).to.lengthOf(1);

      let error: ITypeValidationError = result.errors[0];
      expect(error.errorType).to.equals(ValidationErrorType.TYPE_MISMATCH);
      expect(error.trace).to.length(2);
      expect(error.trace[0].stepName).to.equals('Pet');
      expect(error.trace[1].stepName).to.equals('id');
      expect(error.typeIs).to.equals('string');
      expect(error.typeShouldBe).to.equals('number');

      done();
    }).catch(err => done(new Error(err)));


  });

  it('should invalidate number instead of string', (done) => {
    let pet = {
      id: 123,
      name: 123
    };

    validator.validateModel(pet, 'Pet').then(result => {
      expect(result.errors).to.lengthOf(1);

      let error: ITypeValidationError = result.errors[0];
      expect(error.errorType).to.equals(ValidationErrorType.TYPE_MISMATCH);
      expect(error.trace).to.length(2);
      expect(error.trace[0].stepName).to.equals('Pet');
      expect(error.trace[1].stepName).to.equals('name');
      expect(error.typeIs).to.equals('number');
      expect(error.typeShouldBe).to.equals('string');

      done();
    }).catch(err => done(new Error(err)));
  });

  it('should validate a boolean', (done) => {
    let pet = {
      id: 123,
      name: 'Doge',
      happy: true
    };

    validator.validateModel(pet, 'Pet').then(result => {
      expect(result.errors).to.empty;

      done();
    }).catch(err => done(new Error(err)));
  });

  it('should invalidate string instead of boolean', (done) => {
    let pet = {
      id: 123,
      name: 'Doge',
      happy: 'such happy much wow'
    };

    validator.validateModel(pet, 'Pet').then(result => {
      expect(result.errors).to.lengthOf(1);

      let error: ITypeValidationError = result.errors[0];
      expect(error.errorType).to.equals(ValidationErrorType.TYPE_MISMATCH);
      expect(error.trace).to.length(2);
      expect(error.trace[0].stepName).to.equals('Pet');
      expect(error.trace[1].stepName).to.equals('happy');
      expect(error.typeIs).to.equals('string');
      expect(error.typeShouldBe).to.equals('boolean');

      done();
    }).catch(err => done(new Error(err)));
  });
});
