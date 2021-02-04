import Validator from '../validator'

export class StorageService {
  constructor(namespace) {
    this.namespace = namespace;
    this.setMethod = null;
    this.getMethod = null;
    this.removeMethod = null;
  }

  implement({ setMethod, getMethod, removeMethod, namespace }) {
    new Validator('setMethod', setMethod).required();
    new Validator('getMethod', getMethod).required();
    new Validator('removeMethod', removeMethod).required();
    new Validator('namespace', namespace).string();

    this.setMethod = setMethod;
    this.getMethod = getMethod;
    this.removeMethod = removeMethod;
    this.namespace = namespace;
  }

  _getKey(key) {
    return this.namespace ? `${this.namespace}-${key}` : key;
  }

  async set(key, data) {
    new Validator('key', key).required().string();

    const dataStr = JSON.stringify(data);
    return await this.setMethod(this._getKey(key), dataStr);
  }

  async get(key) {
    new Validator('key', key).required().string();

    const dataStr =  await this.getMethod(this._getKey(key));
    return JSON.parse(dataStr);
  }

  async remove(key) {
    new Validator('key', key).required().string();

    return await this.removeMethod(this._getKey(key));
  }
}

const storage = new StorageService();

export default storage;
