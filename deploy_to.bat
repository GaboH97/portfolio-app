@findstr /B /V @ %~dpnx0 > %~dpn0.ps1 && powershell -ExecutionPolicy Bypass %~dpn0.ps1 %*
@exit /B %ERRORLEVEL%
if ($args.length -ge 7) {
    npm install @types/node
    npm i
    cd portfolio-app-lambda
    npm i
    npm run build
    cd ..
    $env:ACCOUNT, $args = $args
    $env:REGION, $args = $args
    $env:TWITTER_ACCESS_TOKEN_KEY, $args = $args
    $env:TWITTER_ACCESS_TOKEN_SECRET, $args = $args 
    $env:TWITTER_CONSUMER_KEY, $args = $args 
    $env:TWITTER_CONSUMER_SECRET, $args = $args
    $env:TWITTER_BEARER_TOKEN, $args = $args
    npx cdk deploy $args
    exit $lastExitCode
} else {
    [console]::error.writeline("Not enough args.")
    exit 1
}