Operational Errors -> bugs that we can predict will inevitably happen(invalid path , invalid user input , failed to connect)
Programming Errors -> bugs that developers introduce to our code , difficult to find and handle (reading prop on undefined , passing a number where obj is expected)

Handling-> ignoring the error

whenever we pass anything to next middleware it will be an error

If you don't call Error.captureStackTrace,
then the stack trace will include the entire call chain — including the custom error class's constructor and internal calls — which can be unnecessary clutter.

But if you do call Error.captureStackTrace(this, this.constructor),
then it tells Node.js:
“Ignore everything above this constructor in the stack trace.”
So you get a cleaner stack trace that points directly to the actual location in code where the error was thrown — not the internal error creation.
