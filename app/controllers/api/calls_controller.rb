module Api
  class CallsController < ApplicationController
    # Configure Blizzard API
    BlizzardApi.configure do |config|
      config.app_id = ENV['BLIZZARD_CLIENT_ID']
      config.app_secret = ENV['BLIZZARD_CLIENT_SECRET']
      config.region = 'us'
      config.use_cache = true
      config.redis_host = ENV['REDIS_HOST']
      config.redis_port = ENV['REDIS_PORT']
      config.cache_access_token = true
    end

    # Call all realms from Blizzard API, format data, and return as JSON
    def realms 
      # If using a parameter you have to do a two step process to get the index instead of just calling BlizzardApi::Wow::Realm.new.index
      # US realms could be called using BlizzardApi::Wow::Realm.new.index since it's the default, but I'm using the two step process for consistency    
      us = BlizzardApi::Wow::Realm.new region: 'us'
      us_data = us.index
      format_realm(us_data)

      eu = BlizzardApi::Wow::Realm.new region: 'eu'
      eu_data = eu.index
      format_realm(eu_data)

      kr = BlizzardApi::Wow::Realm.new region: 'kr'
      kr_data = kr.index
      format_realm(kr_data)

      tw = BlizzardApi::Wow::Realm.new region: 'tw'
      tw_data = tw.index
      format_realm(tw_data)

      realm_data = {
        us: us_data[:realms],
        eu: eu_data[:realms],
        kr: kr_data[:realms],
        tw: tw_data[:realms]
      }

      render json: realm_data , status: :ok
    end

    # Call races from Blizzard API, format data, and return as JSON
    def races
      race_data = BlizzardApi::Wow::PlayableRace.new.index

      format_races(race_data)

      render json: race_data[:races], status: :ok
    end

    # Call classes from Blizzard API, format data, and return as JSON
    def classes
      class_data = BlizzardApi::Wow::PlayableClass.new.index

      format_classes(class_data)

      render json: class_data[:classes], status: :ok
    end

    # def mounts
    #   mount_index = BlizzardApi::Wow::Mount.new.index

    #   # Call mount details for each mount, loops through 1k+ mounts
    #   mount_index[:mounts].each do |mount|
    #     mount[:mount_detail] = BlizzardApi::Wow.mount.get(mount[:id])
    #   end

    #   format_mounts(mount_index)

    #   render json: mount_index[:mounts], status: :ok
    # end

    # Call mounts from Blizzard API, format data, and return as JSON
    def mounts
      self.class.send(:include, ActionController::Live)

      response.headers['Content-Type'] = 'text/event-stream'
      sse = SSE.new(response.stream)

      begin
        begin
          mount_index = BlizzardApi::Wow::Mount.new.index
        rescue BlizzardApi::ApiException => e
          Rails.logger.error("Failed to get mount index: #{e.code} #{e.message} #{e.response_body}")
          render json: { success: false, error: "Failed to get mount index.", code: e.code }, status: :internal_server_error
          return
        end

        formatted_mount = []

       # sse.write('[')

        first = true

        # Call mount details for each mount, loops through 1k+ mounts
        mount_index[:mounts].each do |mount|
         
          begin
            mount[:mount_detail] = BlizzardApi::Wow.mount.get(mount[:id])
          rescue BlizzardApi::ApiException => e
            Rails.logger.error("Failed to fetch mount details for mount ID #{mount[:id]}: #{e.message}")
            next
          end

          formatted_mount = format_mount(mount)

          # if first
          #   first = false
          # else
          #   sse.write(',')
          # end

          sse.write(formatted_mount.to_json)
        end

       # sse.write('],')
        sse.write('{"endOfStream": true}')
        sse.close
      ensure
        sse.close
      end
    end

    # Call character profile from Blizzard API, format data, and return as JSON
    def profile
      begin
        character = BlizzardApi::Wow::CharacterProfile.new region: params[:region]

        # Call character data
        character_data = character.get(params[:realm], params[:character])
      
        # Call character mounts
        character_data[:mounts] = character.mounts(params[:realm], params[:character])
      
        formatted_data = format_characters(character_data)
      
        render json: formatted_data, status: :ok

      # Rescue from Blizzard API exceptions
      rescue BlizzardApi::ApiException => e
        render json: { success: false, error: "Character does not exist.", code: e.code }, status: :not_found
      end     
    end

    private

    # Format data from Blizzard API
    def format_realm(data)
      data[:realms].each do |realm|
        realm[:name] = realm[:name][:en_US]
        realm[:slug] = realm[:slug]
        realm.delete(:key)
      end
    end

    # Format data from Blizzard API
    def format_classes(data)
      data[:classes].each do |classes|
        classes[:name] = classes[:name][:en_US]
        classes.delete(:key)
      end
    end

    # Format data from Blizzard API
    def format_races(data)
      data[:races].each do |race|
        race[:name] = race[:name][:en_US]
        race.delete(:key)
      end
      
      # One race has two IDs, so delete the duplicate
      data[:races].delete_if { |race| race[:id] == 70 }
    end

    # def format_mounts(data)
    #   data[:mounts].each do |mount|
    #     mount[:name] = mount[:name][:en_US]
    #     mount.delete(:key)
    #     mount[:mount_detail][:creature_displays] = mount[:mount_detail][:creature_displays][0][:id]
        
    #     # Some mounts don't have a faction, source, or requirements, so check if they exist before formatting
    #     if mount[:mount_detail][:faction]
    #       mount[:mount_detail][:faction] = mount[:mount_detail][:faction][:name][:en_US]
    #     end

    #     if mount[:mount_detail][:source]
    #       mount[:mount_detail][:source] = mount[:mount_detail][:source][:name][:en_US]
    #     end

    #     if mount[:mount_detail][:requirements]
    #       # Some mounts have multiple requirements, so check if they exist before formatting
    #       if mount[:mount_detail][:requirements][:faction]
    #         mount[:mount_detail][:requirements][:faction] = mount[:mount_detail][:requirements][:faction][:name][:en_US]
    #       end

    #       if mount[:mount_detail][:requirements][:classes]
    #         mount[:mount_detail][:requirements][:classes] = mount[:mount_detail][:requirements][:classes][0][:name][:en_US]
    #       end

    #       if mount[:mount_detail][:requirements][:races]
    #         mount[:mount_detail][:requirements][:races] = mount[:mount_detail][:requirements][:races][0][:name][:en_US]
    #       end 
    #     end
       
    #     mount[:mount_detail].delete(:_links)
    #     mount[:mount_detail].delete(:name)
    #     mount[:mount_detail].delete(:id)
    #     mount[:mount_detail].delete(:description)
    #   end
    # end

    # Format data from Blizzard API
    def format_mount(mount)  
        mount[:name] = mount[:name][:en_US]        
        mount[:mount_detail][:creature_displays] = mount[:mount_detail][:creature_displays][0][:id]
        
        # Some mounts don't have a faction, source, or requirements, so check if they exist before formatting
        if mount[:mount_detail][:faction]
          mount[:mount_detail][:faction] = mount[:mount_detail][:faction][:name][:en_US]
        end

        if mount[:mount_detail][:source]
          mount[:mount_detail][:source] = mount[:mount_detail][:source][:name][:en_US]
        end

        if mount[:mount_detail][:requirements]
          # Some mounts have multiple requirements, so check if they exist before formatting
          if mount[:mount_detail][:requirements][:faction]
            mount[:mount_detail][:requirements][:faction] = mount[:mount_detail][:requirements][:faction][:name][:en_US]
          end

          if mount[:mount_detail][:requirements][:classes]
            mount[:mount_detail][:requirements][:classes] = mount[:mount_detail][:requirements][:classes][0][:name][:en_US]
          end

          if mount[:mount_detail][:requirements][:races]
            mount[:mount_detail][:requirements][:races] = mount[:mount_detail][:requirements][:races][0][:name][:en_US]
          end 
        end

        mount.delete(:key)
        mount[:mount_detail].delete(:_links)
        mount[:mount_detail].delete(:name)
        mount[:mount_detail].delete(:id)
        mount[:mount_detail].delete(:description)
        
        return mount
    end

    # Character data has a lot of data I don't need, so I'm only formatting the data I need and making a new hash
    def format_characters(data)
      # Format character mounts     
      data[:mounts][:mounts].each do |mount|
        mount[:name] = mount[:mount][:name][:en_US]
        mount[:id] = mount[:mount][:id]
        mount.delete(:mount)
        mount.delete(:is_useable)
      end

      # New hash with only the data I need
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