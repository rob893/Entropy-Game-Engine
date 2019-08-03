module.exports = {
    'roots': [
        '<rootDir>/test'
    ],
    'transform': {
        '^.+\\.tsx?$': 'ts-jest'
    },
    'globals': {
        'ts-jest': {
            'diagnostics': {
                'ignoreCodes': [151001]
            }
        }
    }
};