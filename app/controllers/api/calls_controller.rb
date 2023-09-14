module Api
  class CallsController < ApplicationController
    BlizzardApi.configure do |config|
      config.app_id = ENV['BLIZZARD_CLIENT_ID']
      config.app_secret = ENV['BLIZZARD_CLIENT_SECRET']
      config.region = 'us'
      config.use_cache = true
      config.redis_host = ENV['REDIS_HOST']
      config.redis_port = ENV['REDIS_PORT']
      config.cache_access_token = true
    end

    def realm
      realm = BlizzardApi::Wow.realm
      @realm_data = realm.index

      render 'api/calls/realm', status: :ok
    end

    def mounts
      mount = BlizzardApi::Wow.mount
      @mount_data = mount.index

      render 'api/calls/mounts', status: :ok
    end

    def character
      @character_data = BlizzardApi::Wow.character_profile.get(params[:realm], params[:character])
      @character_mounts = BlizzardApi::Wow.character_mounts.mounts(params[:realm], params[:character])

      render 'api/calls/character', status: :ok
    end
  end
end