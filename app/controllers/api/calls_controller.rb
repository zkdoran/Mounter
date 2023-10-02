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
      us_data = BlizzardApi::Wow::Realm.new.index region: 'us'
      format_realm(us_data)

      eu_data = BlizzardApi::Wow::Realm.new.index region: 'eu'
      format_realm(eu_data)

      kr_data = BlizzardApi::Wow::Realm.new.index region: 'kr'
      format_realm(kr_data)

      tw_data = BlizzardApi::Wow::Realm.new.index region: 'tw'
      format_realm(tw_data)

      realm_data = {
        us: us_data[:realms],
        eu: eu_data[:realms],
        kr: kr_data[:realms],
        tw: tw_data[:realms]
      }

      render json: realm_data , status: :ok
    end

    def races
      race_data = BlizzardApi::Wow::PlayableRace.new.index

      format_races(race_data)

      render json: race_data[:races], status: :ok
    end

    def classes
      class_data = BlizzardApi::Wow::PlayableClass.new.index

      format_classes(class_data)

      render json: class_data[:classes], status: :ok
    end

    def mounts
      mount_index = BlizzardApi::Wow::Mount.new.index

      mount_index[:mounts].each do |mount|
        mount[:mount_detail] = BlizzardApi::Wow.mount.get(mount[:id])
      end

      format_mounts(mount_index)

      render json: mount_index[:mounts], status: :ok
    end

    def profile
      character = BlizzardApi::Wow::CharacterProfile.new region: params[:region]

      character_data = character.get(params[:realm], params[:character])

      character_data[:mounts] = character.mounts(params[:realm], params[:character])

      formatted_data = format_characters(character_data)

      render json: formatted_data, status: :ok
    end

    private

    def format_realm(data)
      data[:realms].each do |realm|
        realm[:name] = realm[:name][:en_US]
        realm[:slug] = realm[:slug]
        realm.delete(:key)
      end
    end

    def format_classes(data)
      data[:classes].each do |classes|
        classes[:name] = classes[:name][:en_US]
        classes.delete(:key)
      end
    end

    def format_races(data)
      data[:races].each do |race|
        race[:name] = race[:name][:en_US]
        race.delete(:key)
      end
      
      data[:races].delete_if { |race| race[:id] == 70 }
    end

    def format_mounts(data)
      data[:mounts].each do |mount|
        mount[:name] = mount[:name][:en_US]
        mount.delete(:key)
        mount[:mount_detail][:creature_displays] = mount[:mount_detail][:creature_displays][0][:id]
        mount[:mount_detail].delete(:_links)
        mount[:mount_detail].delete(:name)
        mount[:mount_detail].delete(:id)
        mount[:mount_detail].delete(:description)
      end
    end

    def format_characters(data)     
      data[:mounts][:mounts].each do |mount|
        mount[:name] = mount[:mount][:name][:en_US]
        mount[:id] = mount[:mount][:id]
        mount.delete(:mount)
        mount.delete(:is_useable)
      end

      formatted_character = {
        name: data[:name],
        realm: data[:realm][:slug],
        faction: data[:faction][:name][:en_US],
        race: data[:race][:name][:en_US],
        character_class: data[:character_class][:name][:en_US],
        mounts: data[:mounts][:mounts]
      }

      return formatted_character
    end

  end
end