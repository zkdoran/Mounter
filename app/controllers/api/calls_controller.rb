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

    def realms     
      us_realm = BlizzardApi::Wow::Realm.new region: 'us'

      us_data = us_realm.index

      eu_realm = BlizzardApi::Wow::Realm.new region: 'eu'

      eu_data = eu_realm.index

      kr_realm = BlizzardApi::Wow::Realm.new region: 'kr'

      kr_data = kr_realm.index

      tw_realm = BlizzardApi::Wow::Realm.new region: 'tw'

      tw_data = tw_realm.index

      realm_data = {
        us: us_data[:realms],
        eu: eu_data[:realms],
        kr: kr_data[:realms],
        tw: tw_data[:realms]
      }

      render json: realm_data , status: :ok
    end

    def races
      race = BlizzardApi::Wow::PlayableRace.new

      race_data = race.index

      render json: race_data, status: :ok
    end

    def classes
      class_data = BlizzardApi::Wow::PlayableClass.new.index

      render json: class_data, status: :ok
    end

    def mounts
      mount = BlizzardApi::Wow::Mount.new

      mount_index = mount.index

      mount_index[:mounts].each do |mount|
        mount[:mount_detail] = BlizzardApi::Wow.mount.get(mount[:id])
      end

      render json: mount_index, status: :ok
    end

    def profile
      character = BlizzardApi::Wow::CharacterProfile.new region: params[:region]

      character_data = character.get(params[:realm], params[:character])

      character_data[:mounts] = character.mounts(params[:realm], params[:character])

      render json: character_data, status: :ok
    end
  end
end