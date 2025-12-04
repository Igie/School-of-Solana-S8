/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/notes.json`.
 */
export type Notes = {
  "address": "7YLJ1sK4aRMzRzqkPrHchAGEa9kfKYr5XTgsPMVVSHAJ",
  "metadata": {
    "name": "notes",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "closeNote",
      "discriminator": [
        191,
        76,
        94,
        16,
        132,
        188,
        229,
        95
      ],
      "accounts": [
        {
          "name": "note",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  111,
                  116,
                  101,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "note.name",
                "account": "note"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "editNote",
      "discriminator": [
        140,
        185,
        19,
        79,
        178,
        15,
        150,
        250
      ],
      "accounts": [
        {
          "name": "note",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  111,
                  116,
                  101,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "note.name",
                "account": "note"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "value",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeNote",
      "discriminator": [
        16,
        209,
        254,
        91,
        57,
        218,
        201,
        45
      ],
      "accounts": [
        {
          "name": "note",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  111,
                  116,
                  101,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "value",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "note",
      "discriminator": [
        203,
        75,
        252,
        196,
        81,
        210,
        122,
        126
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "nameTooLong"
    },
    {
      "code": 6001,
      "name": "valueTooLong"
    },
    {
      "code": 6002,
      "name": "valueIsSame"
    }
  ],
  "types": [
    {
      "name": "note",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "initTime",
            "type": "i64"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "value",
            "type": "string"
          }
        ]
      }
    }
  ]
};
