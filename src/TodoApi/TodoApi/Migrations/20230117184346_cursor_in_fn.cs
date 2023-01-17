using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    public partial class cursor_in_fn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var fn = @"CREATE OR ALTER FUNCTION [dbo].[CountUsers]()
RETURNS INT
AS
BEGIN
	DECLARE @user_count as int;
	DECLARE @Id as int;
	Declare @cursor as CURSOR;
	SET @user_count = 0;

	SET @cursor = CURSOR FOR
	SELECT Id FROM [dbo].[Users]

	OPEN @cursor;
	FETCH NEXT FROM @cursor INTO @Id;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		SET @user_count = [dbo].[IncreaseByOne](@user_count);
		FETCH NEXT FROM @cursor INTO @Id;
	END
	CLOSE @cursor;
	DEALLOCATE @cursor;
	RETURN @user_count;
END";

            migrationBuilder.Sql(fn);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
