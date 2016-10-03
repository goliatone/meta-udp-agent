package main

import (
    "fmt"
    "flag"
    "net"
	"os"
    "time"
    "log"
    "math/rand"
)

var (
    sessionID string
	localAddr = ":0"
	serverAddr = "224.0.0.1:1234"
)

func init() {
	rand.Seed(time.Now().UnixNano())
    sessionID = generateSessionID(12)
}

func main() {
	body := flag.String("body", "empty", "String to be sent as body message")
	pings := flag.Int("pings", 5, "How many consecutive pings to send")
    command := flag.String("command", "/alive", "Command we want to request")

	flag.Parse()

	log.Println("body is " + *body)

	LocalAddr, err := net.ResolveUDPAddr("udp", localAddr)
    ServerAddr,err := net.ResolveUDPAddr("udp", serverAddr)
    checkError(err)

    Conn, err := net.ListenUDP("udp", LocalAddr)
    checkError(err)

    defer Conn.Close()

	for i := 0; i < *pings; i++ {
		buf := []byte("request;" + sessionID + ";" + *command + ";" + *body)
        _,err := Conn.WriteTo(buf, ServerAddr)

        if err != nil {
            fmt.Println(body, err)
        }

        buf = make([]byte, 1024)
        n, addr, err := Conn.ReadFrom(buf)
        checkError(err)

        log.Println("Received ", string(buf[0:n]), " from ", addr)

        time.Sleep(time.Second * 4)
    }

	os.Exit(0)
}

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func generateSessionID(n int) string {
    b := make([]byte, n)
    for i := range b {
        b[i] = letterBytes[rand.Intn(len(letterBytes))]
    }
    return string(b)
}

func checkError(err error) {
    if err  != nil {
        fmt.Println("Error: " , err)
    }
}
