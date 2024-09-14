class CustomError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.name = this.constructor.name;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}


class CustomerErrorGenerator {
    constructor(prefix) {
        this.prefix = prefix;
    }
    generate(message, errorCode){
        return new CustomError(message, this.prefix + "-" + errorCode);
    }
}

module.exports = {
    CustomError,
    CustomerErrorGenerator
};