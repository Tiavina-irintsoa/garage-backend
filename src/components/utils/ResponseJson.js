class ResponseJson {
  constructor(data = null, error = null, status = 200) {
    this.data = data;
    this.error = error;
    this.status = status;
  }

  static success(data, status = 200) {
    return new ResponseJson(data, null, status);
  }

  static error(error, status = 400) {
    return new ResponseJson(null, error, status);
  }

  toJSON() {
    return {
      data: this.data,
      error: this.error,
      status: this.status,
    };
  }
}

module.exports = ResponseJson;
