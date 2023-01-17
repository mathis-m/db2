using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    public partial class fn_useless : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var fn = @"CREATE OR ALTER FUNCTION [dbo].[IncreaseByOne](
	            @value int
            )
            RETURNS INT
            AS
            BEGIN
	            RETURN @value + 1;
            END";

            migrationBuilder.Sql(fn);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
