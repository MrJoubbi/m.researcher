#!/bin/bash
# =====================================================================
# Moroccan Researcher - VPS Deployment Helper Script
# =====================================================================

set -e

echo "🚀 Préparation du déploiement Moroccan Researcher..."

# 1. Build production dist
npm run build

echo "✅ Build de production terminé avec succès dans ./dist"

# Mode d'utilisation :
# Option A - Si vous exécutez ce script depuis votre machine locale vers votre VPS :
# ./deploy.sh user@votre-ip-vps /var/www/html

TARGET_SSH=${1:-""}
TARGET_PATH=${2:-"/var/www/html"}

if [ -n "$TARGET_SSH" ]; then
    echo "📡 Envoi des fichiers de production vers $TARGET_SSH:$TARGET_PATH..."
    rsync -avz --delete dist/ "$TARGET_SSH":"$TARGET_PATH/"
    echo "🎉 Déploiement réussi sur votre VPS !"
else
    echo ""
    echo "📦 Archive de déploiement prête :"
    tar -czf site-deploy.tar.gz -C dist .
    echo "   Fichier généré : site-deploy.tar.gz"
    echo ""
    echo "💡 Pour déployer directement sur votre VPS :"
    echo "   1) Via rsync :"
    echo "      rsync -avz --delete dist/ root@VOTRE_IP_VPS:/var/www/html/"
    echo ""
    echo "   2) Ou via SCP (archive) :"
    echo "      scp site-deploy.tar.gz root@VOTRE_IP_VPS:/tmp/"
    echo "      ssh root@VOTRE_IP_VPS 'tar -xzf /tmp/site-deploy.tar.gz -C /var/www/html/ && nginx -s reload'"
fi
