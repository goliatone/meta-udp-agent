```
echo "B46A0A75-7611-4CFD-BEFD-69E878561BB4" > ~/.uuid
```


copy cudp and metapi in CODE directory

cron:
```
* * * * * /home/pi/CODE/cudp -body=$(/home/pi/CODE/metapi) >> /home/pi/logs/cudp.log 2>&1
```

logging:

```
mkdir ~/logs/
```


logrotate:
`sudo nano /etc/logrotate.conf`

```
/home/pi/logs/cudp.log {
   compress
   weekly
   missingok
   rotate 4
   create 0660 pi pi
}
```

```
sudo logrotate -f /etc/logrotate.conf
```


TODO:
- [ ] Store UUID in device in known place
- [ ] Generate medata file which contains body to be sent on ping



uuid:B46A0A75-7611-4CFD-BEFD-69E878561BB4 serial:000000002b34537e
