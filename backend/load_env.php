<?php

function loadEnv($filePath)
{
    $envVars = [];
    if (file_exists($filePath)) {
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            // Ignore comments or invalid lines
            if (strpos(trim($line), '#') === 0 || trim($line) === '') continue;

            list($key, $value) = explode('=', $line, 2);
            if ($key && $value) {
                $envVars[trim($key)] = trim($value);
            }
        }
    }

    return $envVars;
}

// Load the environment variables
$env = loadEnv(__DIR__ . '/.env');
