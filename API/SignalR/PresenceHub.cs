using System;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;
[Authorize]
public class PresenceHub : Hub
{
    private PresenceTracker _presenceTracker;

    public PresenceHub(PresenceTracker presenceTracker)
    {
        _presenceTracker = presenceTracker;
    }
    [Authorize]
    public override async Task OnConnectedAsync()
    {
        var username = Context?.User?.GetUsername();
        if (username is null || Context is null) return;
        var isOnline = await _presenceTracker.UserConnected(username, Context.ConnectionId);
        if (isOnline)
            await Clients.Others
                .SendAsync("UserOnline", username);
        var onlineUsers = await _presenceTracker.GetOnlineUsers();
        await Clients.Caller.SendAsync("OnlineUsers", onlineUsers);
    }
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var username = Context?.User?.GetUsername();
        if (username is null || Context is null) return;
        var isOffline = await _presenceTracker.UserDisconnected(username, Context.ConnectionId);
        if (isOffline)
            await Clients.Others.SendAsync("UserOffline", username);
        await base.OnDisconnectedAsync(exception);
    }
}
