package main

import (
	"encoding/json"
	"fmt"
	"log"

	"gosrc.io/mqtt"
)

type Status struct {
	ID         string `json:"id"`
	Msg        string `json:"msg"`
	Quantidade int    `json:"quantidade"`
	Pedidos    int    `json:"pedidos"`
	Entregas   int    `json:"entregas"`
	Perda      int    `json:"perda"`
}

func main() {
	client := mqtt.NewClient("tcp://mqtt.feira-de-jogos.dev.br:1883")
	client.ClientID = "backend-vending"

	msgs := make(chan mqtt.Message)
	client.Messages = msgs

	err := client.Connect(msgs)

	if err != nil {
		fmt.Println("Erro:", err)
		return
	}

	client.Subscribe(mqtt.Topic{
		Name: "vending/status",
		QOS:  1,
	})

	go func() {
		for msg := range msgs {

			if msg.Topic != "vending/status" {
				continue
			}

			var status Status

			err := json.Unmarshal(msg.Payload, &status)
			if err != nil {
				log.Println(err)
				continue
			}

			fmt.Printf(
				"[%s] %s | estoque=%d pedidos=%d entregas=%d perda=%d\n",
				status.ID,
				status.Msg,
				status.Quantidade,
				status.Pedidos,
				status.Entregas,
				status.Perda,
			)
		}
	}()

	select {}

}
