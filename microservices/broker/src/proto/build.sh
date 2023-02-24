
# ts_proto_opt=snakeToCamel=false поля храняться как в proto файле
# ts_proto_opt=nestJs=true всё возвращается как Observable как в Nest'е
<<<<<<< HEAD
protoc --ts_proto_out=./ --ts_proto_opt=snakeToCamel=false --ts_proto_opt=nestJs=true ./*.proto
=======
protoc --ts_proto_out=./ --ts_proto_opt=snakeToCamel=false --ts_proto_opt=nestJs=true --experimental_allow_proto3_optional ./*.proto
>>>>>>> c64b367a04156823befc2705327eb7aeb553abd3
# --js_out=import_style=commonjs,binary:./ --grpc-web_out=import_style=typescript,mode=grpcwebtext:./ ./proto/*.proto
