class Validator {
  constructor(label, value) {
    if (!label && typeof label !== 'string')
      throw new Error('Missing or invalid label');
  
    this.value = value;
    this.label = label;
    this.isRequired = false;
  }
  
  _throwError(message) {
    throw new Error(
      `Validating "${this.label}" failed: ${message}. Found ${JSON.stringify(
        this.value
      )} (type of ${typeof this.value})`
    );
  }
  
  _isDefined() {
    return this.value !== null && this.value !== undefined;
  }
  
  _onCondition(condition, message) {
    if (
      ((!this.isRequired && this._isDefined()) || this.isRequired) &&
        !condition()
    ) {
      this._throwError(message);
    }
  
    return this;
  }
  
  required(message = 'Required') {
    this.isRequired = true;
    return this._onCondition(() => this._isDefined(), message);
  }
  
  string(message = 'Must be a string') {
    return this._onCondition(() => typeof this.value === 'string', message);
  }
  
  boolean(message = 'Must be a boolean') {
    return this._onCondition(() => typeof this.value === 'boolean', message);
  }
  
  function(message = 'Must be a function') {
    return this._onCondition(() => typeof this.value === 'function', message);
  }
  
  object(message = 'Must be an object') {
    return this._onCondition(
      () => typeof this.value === 'object' && this.value !== null,
      message
    );
  }
  
  array(message = 'Must be an array') {
    return this._onCondition(() => this.value instanceof Array, message);
  }
  
  number(message = 'Must be a valid number and larger than 0') {
    return this._onCondition(
      () => Number.isFinite(this.value) && this.value >= 0,
      message
    );
  }
  
  intergerNumber(
    message = 'Must be a valid interger number and larger than 0'
  ) {
    return this._onCondition(
      () => Number.isInteger(this.value) && this.value >= 0,
      message
    );
  }

  paymentAddress(message = 'Invalid payment address') {
    return this._onCondition(() => this.string(), message);
  }

  /**
   *
   * @param {number} value amount in nano (must be an integer number)
   * @param {string} message error message
   */
  nanoAmount(message = 'Invalid nano amount') {
    return this._onCondition(() => this.intergerNumber(), message);
  }

  /**
   *
   * @param {string} value amount (must be an string)
   * @param {string} message error message
   */
  amount(message = 'Invalid amount') {
    return this._onCondition(() => this.string(), message);
  }

  token(message = 'Invalid token') {
    return this._onCondition(() => this.object(), message);
  }

  tokenId(message = 'Invalid token id') {
    return this._onCondition(() => this.string(), message);
  }
}
  
export default Validator;