using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMessageRepository
{
    void AddMessage(Message message);
    void DeleteMessage(Message message);
    Task<Message?> GetMessage(int id);
    Task<PageList<MessageDto>> GetUserMessages(MessageParams messageParams);
    Task<IEnumerable<MessageDto>> GetMessageThread(string recipientUserName, string SenderUsername);
    Task<bool> SaveAllAsync();
}