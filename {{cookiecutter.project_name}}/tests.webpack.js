var context = require.context('./client', true, /\.spec\.jsx$/);
context.keys().forEach(context);
