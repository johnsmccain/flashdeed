#!/bin/bash

echo "Stopping development environment..."
pkill -f anvil
pkill -f "next dev"
echo "✅ All processes stopped"