@echo off
echo Starting database container in background...
docker-compose up -d

echo Waiting 10 seconds for database to be ready...
timeout /t 10 /nobreak > nul

echo Installing npm dependencies...
call npm install

echo Generating Prisma client...
call npx prisma generate

echo Running Prisma migrations...
call npx prisma migrate dev

echo Building the project...
call npm run build

echo Starting the application...
call npm start

echo.
echo ===============================
echo Application started.
echo Press any key to exit...
pause

rem 无限等待，防止窗口自动关闭
:waitloop
timeout /t 3600 /nobreak > nul
goto waitloop