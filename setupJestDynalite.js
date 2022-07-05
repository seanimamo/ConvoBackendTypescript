const { setup } = require("jest-dynalite");

// This file setups jest-dynalite by supplying the initial dynamo table configuration.

// This must point to a directory with a file named jest-dynalite-config.
setup(__dirname);