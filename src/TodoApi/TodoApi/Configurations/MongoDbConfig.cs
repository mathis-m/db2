namespace TodoApi.Configurations
{
    public class MongoDbConfig
    {
        public string Name { get; init; }
        public string Host { get; init; }
        public string Username { get; init; }
        public string Password { get; init; }
        public int Port { get; init; }
        public string ConnectionString => $"mongodb://{Username}:{Password}@{Host}:{Port}";
    }
}
