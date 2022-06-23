FROM ethereum/client-go:alltools-v1.8.20
COPY keystore /root/.ethereum/keystore
COPY competency_passbook.json .
COPY .password.env .
RUN geth init competency_passbook.json
EXPOSE 8545
EXPOSE 30303
EXPOSE 30301/udp
