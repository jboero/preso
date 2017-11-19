#!/bin/bash -x

vault unseal
otp=$(vault generate-root -genotp | awk '{ print $2 }')
tok=$(vault generate-root -otp="$otp")
vault generate-root -otp="$otp" -decode="<encoded-token>"
