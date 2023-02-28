
const notFound = (req, res, next) => {

	const error = new Error(`Not Found - ${req.originalUrl}`);
	
	res.status(404);
	// Calls the next middleware passing along the error
	next(error);
};

const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: err.message,
		// Returns stack trace for debugging if not in production mode
		stack: process.env.NODE_ENV === 'production' ? null : err.stack,
	});
};

export { notFound, errorHandler };
